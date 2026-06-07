import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPerformanceReport, getBalanceReport, getMyPerformance } from '../../api/reports';
import { useHouse } from '../../contexts/HouseContext';
import { useToast } from '../../components/UI/Toast';
import { Input } from '../../components/UI/Input';
import { Badge } from '../../components/UI/Badge';
import { PageSpinner } from '../../components/UI/Spinner';
import type { PerformanceReport, BalanceReport, MyPerformanceReport } from '../../types';

function CompletionRing({ rate }: { rate: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (rate / 100) * circ;
  const color = rate >= 80 ? '#4A7C59' : rate >= 50 ? '#C09030' : '#B54848';
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="ring">
      <circle cx="26" cy="26" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="26" y="30" textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>
        {Math.round(rate)}%
      </text>
    </svg>
  );
}

function PerfStats({ m }: { m: { completed: number; pending: number; overdue: number; redistributed: number; total_assigned: number; completion_rate: number; name: string } }) {
  return (
    <div className="perf-card">
      <div className="perf-card__top">
        <div className="perf-card__avatar">{m.name.charAt(0)}</div>
        <div className="perf-card__info">
          <div className="perf-card__name">{m.name}</div>
          <div className="perf-card__total">{m.total_assigned} tarefas atribuídas</div>
        </div>
        <CompletionRing rate={m.completion_rate} />
      </div>
      <div className="perf-card__stats">
        <div className="perf-stat">
          <span className="perf-stat__value perf-stat__value--success">{m.completed}</span>
          <span className="perf-stat__label">Concluídas</span>
        </div>
        <div className="perf-stat">
          <span className="perf-stat__value perf-stat__value--warn">{m.pending}</span>
          <span className="perf-stat__label">Pendentes</span>
        </div>
        <div className="perf-stat">
          <span className="perf-stat__value perf-stat__value--danger">{m.overdue}</span>
          <span className="perf-stat__label">Atrasadas</span>
        </div>
        <div className="perf-stat">
          <span className="perf-stat__value">{m.redistributed}</span>
          <span className="perf-stat__label">Redistribuídas</span>
        </div>
      </div>
    </div>
  );
}

export function Reports() {
  const { houseId } = useParams<{ houseId: string }>();
  const { currentHouse } = useHouse();
  const toast = useToast();

  const isAdmin = currentHouse?.role === 'admin';

  const today = new Date().toISOString().split('T')[0];
  const thirtyAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  const [performance, setPerformance] = useState<PerformanceReport | null>(null);
  const [balance, setBalance] = useState<BalanceReport | null>(null);
  const [myPerf, setMyPerf] = useState<MyPerformanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(thirtyAgo);
  const [dateTo, setDateTo] = useState(today);

  const fetchData = async () => {
    if (!houseId) return;
    setLoading(true);
    try {
      if (isAdmin) {
        const [perfRes, balRes] = await Promise.all([
          getPerformanceReport(houseId, { date_from: dateFrom, date_to: dateTo }),
          getBalanceReport(houseId),
        ]);
        setPerformance(perfRes.data);
        setBalance(balRes.data);
      } else {
        const { data } = await getMyPerformance(houseId, { date_from: dateFrom, date_to: dateTo });
        setMyPerf(data);
      }
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [houseId, dateFrom, dateTo, isAdmin]);

  if (loading) return <PageSpinner />;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Relatórios</h1>
          <p className="page__subtitle">
            {isAdmin ? 'Desempenho e balanceamento da casa' : 'Meu desempenho'}
          </p>
        </div>
      </div>

      <div className="page__toolbar">
        <Input
          id="rep-from"
          label="De"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <Input
          id="rep-to"
          label="Até"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      {isAdmin && balance && (
        <section className="report-section">
          <h2 className="report-section__title">Balanceamento de Esforço</h2>
          <div className={`balance-status ${balance.within_tolerance ? 'balance-status--ok' : 'balance-status--warn'}`}>
            <span className="balance-status__icon">{balance.within_tolerance ? '✓' : '⚠'}</span>
            <span>
              {balance.within_tolerance ? 'Dentro da tolerância' : 'Fora da tolerância'}
              {' '}— Tolerância: ±{balance.tolerance_percentage}pp
            </span>
            {balance.using_equal_distribution && (
              <Badge variant="info">Distribuição igualitária</Badge>
            )}
          </div>
          <div className="balance-grid">
            {balance.members.map((m) => (
              <div key={m.user_id} className="balance-card">
                <div className="balance-card__name">{m.name}</div>
                <div className="balance-card__bars">
                  <div className="balance-bar-wrap">
                    <span className="balance-bar__label">Alvo</span>
                    <div className="balance-bar__track">
                      <div className="balance-bar__fill balance-bar__fill--target" style={{ width: `${m.target_percentage}%` }} />
                    </div>
                    <span className="balance-bar__pct">{m.target_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="balance-bar-wrap">
                    <span className="balance-bar__label">Real</span>
                    <div className="balance-bar__track">
                      <div
                        className={`balance-bar__fill ${m.within_tolerance ? 'balance-bar__fill--ok' : 'balance-bar__fill--warn'}`}
                        style={{ width: `${m.actual_percentage}%` }}
                      />
                    </div>
                    <span className="balance-bar__pct">{m.actual_percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className={`balance-card__deviation ${m.within_tolerance ? '' : 'balance-card__deviation--warn'}`}>
                  Desvio: {m.deviation > 0 ? '+' : ''}{m.deviation.toFixed(1)}pp
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isAdmin && performance && (
        <section className="report-section">
          <h2 className="report-section__title">Desempenho por Morador</h2>
          <div className="perf-grid">
            {performance.members.map((m) => (
              <PerfStats key={m.user_id} m={m} />
            ))}
          </div>
        </section>
      )}

      {!isAdmin && myPerf && (
        <section className="report-section">
          <h2 className="report-section__title">Meu Desempenho</h2>
          <div className="perf-grid">
            <PerfStats m={myPerf} />
          </div>
        </section>
      )}
    </div>
  );
}
