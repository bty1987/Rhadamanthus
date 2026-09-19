package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceDccountDao;
import com.fanglin.balance.po.BalanceDccountPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceDccountDao")
public class BalanceDccountDaoImpl extends DaoImpl<BalanceDccountPO> implements BalanceDccountDao {

	public BalanceDccountDaoImpl() {
		super(BalanceDccountPO.class);
	}

	@Override
	public List<BalanceDccountPO> pageBalanceDccount (Paging paging, List<Filter> filters) {

		PagingQuery<BalanceDccountPO> query = pagingQuery(paging, BalanceDccountPO.class);

		queryFilterExcute(query, filters);

		query.desc("bdid");

		return query.list();

	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){

		if(filters != null){
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if(field.equals("name")){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals("status")){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}
			}
		}
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<BalanceDccountPO> queryBalanceDccount(int buid) {
		return session().createCriteria(BalanceDccountPO.class).add(Restrictions.eq("belonger.uid", buid)).list();
	}

	@Override
	public void updateBalanceDccountForSurplus(long bdid, long money) {

		String sql = "update balancedccount set surplus = surplus + :money where bdid = :bdid";

		session().createSQLQuery(sql).setLong("bdid", bdid).setLong("money", money).executeUpdate();
	}

}
