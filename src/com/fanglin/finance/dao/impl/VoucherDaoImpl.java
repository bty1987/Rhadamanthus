/**
 * @File Name		: VoucherDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.dao.VoucherDao;
import com.fanglin.finance.po.VoucherPO;
import com.fanglin.utils.Paging;

@Repository("voucherDao")
public class VoucherDaoImpl extends DaoImpl<VoucherPO> implements VoucherDao {

	public VoucherDaoImpl(){
		super(VoucherPO.class);
	}

	@Override
	public List<VoucherPO> pageVoucher(Paging paging, List<Filter> filters, String condition) {
		
		PagingQuery<VoucherPO> query = pagingQuery(paging, VoucherPO.class);
		
		if(filters != null && filters.size() != 0){
			queryFilterExcute(query, filters);
			
			return query.list();
		}else if(condition != null){
			Map<String, String> hql = queryConditionExcute(query, condition);
			
			return query.list("*", hql.get("select"), hql.get("from"), hql.get("where"));
		}else{
			return new ArrayList<VoucherPO>();
		}
	}
	
	@Override
	public VoucherPO queryVoucherByVId(long vid) {
		return (VoucherPO) session().createCriteria(VoucherPO.class).add(Restrictions.eq(VoucherPO.COLUMN_VID_STR, vid)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<VoucherPO> queryVoucherByVIds(List<Long> vIds) {
		return session().createCriteria(VoucherPO.class).add(Restrictions.in(VoucherPO.COLUMN_VID_STR, vIds)).list();
	}

	@Override
	public int updateVoucherForStatusByPeriod(String period, short status) {
		
		String sql = "update finance.voucher set status = :status where period = :period";
		session().createSQLQuery(sql).setString("period", period).setShort("status", status).executeUpdate();
		
		return 0;
	}

	@Override
	public int alowVoucherForPeriodByPrecut(String period, String nextPeriod) {
		
		String sql = "update finance.voucher set period = :nextPeriod where period = :period and status = :status";
		session().createSQLQuery(sql).setString("period", period).setString("nextPeriod", nextPeriod).setShort("status", VoucherPO.STATUS_TYPE_PRECUT_INT).executeUpdate();
		
		return 0;
	}
	
	@Override
	public VoucherPO merge(VoucherPO voucherPO) {
		return (VoucherPO) financeSession().merge(voucherPO);
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
	}
	
	private Map<String, String> queryConditionExcute(PagingQuery<?> query, String condition){
		
		Map<String, String> hql = new HashMap<String, String>();
		
		condition = condition.replace("a.ou", "x.originator.uid").replace("a.pu", "x.postor.uid").replace("a.ct", "x.createTime").replace("a.pt", "x.postTime").replace("a.p", "x.period");
		condition = condition.replace("y.a", "y.abstracts");
		
		String from = null;
		String where = String.format("where %s", condition);
		
		if(where.indexOf("b.") != -1){
			from = "from VoucherPO as x join a.accounts as y";
		}else{
			from = "from VoucherPO as x";
		}
		
		hql.put("select", "select x");
		hql.put("from", from);
		hql.put("where", where);
		
		return hql;
	}
	
}
