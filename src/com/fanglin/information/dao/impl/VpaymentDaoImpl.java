package com.fanglin.information.dao.impl;


import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.VpaymentDao;
import com.fanglin.information.po.VpaymentPO;
import com.fanglin.utils.Paging;

@Repository("vpaymentDao")
public class VpaymentDaoImpl extends DaoImpl<VpaymentPO> implements VpaymentDao{
	
	public VpaymentDaoImpl(){
		super(VpaymentPO.class);
	}

	@Override
	public List<VpaymentPO> pageVpayment(Paging paging, List<Filter> filters, Short status) {
		
		PagingQuery<VpaymentPO> query = pagingQuery(paging, VpaymentPO.class);
		
		queryFilterExcute(query, filters);
		
		if(status != null){
			query.add(Restrictions.eq(VpaymentPO.COLUMN_STATUS_STR, status));
		}
		
		query.add(Restrictions.eq(VpaymentPO.COLUMN_EXPIRE_STR, VpaymentPO.EXPIRE_INIT_INT));
		
		query.desc("vpid");
		
		return query.list();
	}
	
	@Override
	public List<?> countVpayment() {
		
		String sql = "SELECT brand, SUM(money) from information.vpayment WHERE type in (2, 3) and expire = 0 GROUP BY brand";
		
		SQLQuery query = session().createSQLQuery(sql);
		
		return query.list();
	}


	@Override
	@SuppressWarnings("unchecked")
	public List<VpaymentPO> queryVpaymentByNo(String mno) {
		return createCriteria(VpaymentPO.class).add(Restrictions.eq(VpaymentPO.COLUMN_MNO_STR, mno)).add(Restrictions.eq(VpaymentPO.COLUMN_EXPIRE_STR, VpaymentPO.EXPIRE_INIT_INT)).list();
	}


	@Override
	@SuppressWarnings("unchecked")
	public List<VpaymentPO> queryVpaymentByVrid(long vrid) {
		return session().createCriteria(VpaymentPO.class).createAlias("vreceipt", "vreceipt").add(Restrictions.eq("vreceipt.vrid", vrid)).list();
	}
	
	@Override
	public int updateVpaymentStatusForFailure(long vaid) {
		
		String sql = "update information.vpayment set expire = :expire where vaid = :vaid";
		session().createSQLQuery(sql).setShort("expire", VpaymentPO.EXPIRE_INVALID_INT).setLong("vaid", vaid).executeUpdate();
		
		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null && filters.size() > 0){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(VpaymentPO.COLUMN_MNO_STR.equals(field)){
					query.add(query.getCriterion(VpaymentPO.COLUMN_MNO_STR, data, op));
				}else if(VpaymentPO.COLUMN_BRAND_STR.equals(field)){
					query.add(query.getCriterion(VpaymentPO.COLUMN_BRAND_STR, data, op));
				}else if("creater".equals(field)){
					query.alias("creater", "creater");
					query.add(query.getCriterion(VpaymentPO.COLUMN_CREATER_STR, data, op));
				}else if("status".equals(field)){
					query.add(Restrictions.eq(VpaymentPO.COLUMN_STATUS_STR,Short.valueOf(data)));
				}
			}
		}
	}

}
