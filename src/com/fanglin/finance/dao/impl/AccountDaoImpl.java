/**
 * @File Name		: AccountDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.dao.AccountDao;
import com.fanglin.finance.po.AccountPO;
import com.fanglin.utils.Paging;

@Repository("accountDao")
public class AccountDaoImpl extends DaoImpl<AccountPO> implements AccountDao {
	
	public AccountDaoImpl(){
		super(AccountPO.class);
	}
	
	@Override
	public List<AccountPO> pageAccount(Paging paging, List<Filter> filters, String condition) {
		
		PagingQuery<AccountPO> query = pagingQuery(paging, AccountPO.class);
		
		if(filters != null && filters.size() != 0){
			queryFilterExcute(query, filters);
			
			return query.list();
		}else if(condition != null){
			Map<String, String> hql = queryConditionExcute(query, condition);
			
			return query.list("b", hql.get("select"), hql.get("from"), hql.get("where"));
		}else{
			return new ArrayList<AccountPO>();
		}
		
	}

	@Override
	public int countAccountByCode(String oneCode, String twoCode, String thrCode) {
		
		String sql = "select count(*) from finance.account where oneCode = :oneCode and twoCode = :twoCode and thrCode = :thrCode";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("oneCode", oneCode).setString("twoCode", twoCode).setString("thrCode", thrCode).uniqueResult();
		
		return count.intValue();
	}

	@Override
	public int updateAccountForStatusByVId(long vId, short status) {
		
		String sql = "update finance.account set status = :status where vId = :vId";
		session().createSQLQuery(sql).setLong("vId", vId).setShort("status", status).executeUpdate();
		
		return 0;
	}

	@Override
	public int updateAccountForStatusByPeriod(String period, short status) {
		
		String sql = "update finance.account set status = :status where period = :period";
		session().createSQLQuery(sql).setString("period", period).setShort("status", status).executeUpdate();
		
		return 0;
	}

	@Override
	public int alowAccountForPeriodByPrecut(String period, String nextPeriod) {
		
		String sql = "update finance.account set period = :nextPeriod where period = :period and status = :status";
		session().createSQLQuery(sql).setString("period", period).setString("nextPeriod", nextPeriod).setShort("status", AccountPO.STATUS_TYPE_PRECUT_INT).executeUpdate();
		
		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
	}
	
	private Map<String, String> queryConditionExcute(PagingQuery<?> query, String condition){
		
		Map<String, String> hql = new HashMap<String, String>();
		
		condition = condition.replace("a.ou", "b.voucher.originator.uid").replace("a.pu", "b.voucher.postor.uid").replace("a.ct", "b.voucher.createTime").replace("a.pt", "b.voucher.postTime").replace("a.p", "b.voucher.period");
		condition = condition.replace("c.oi", "b.assistant.orderId")
				.replace("c.mn", "b.assistant.msoNo").replace("c.du", "b.assistant.designer.uid")
				.replace("c.su", "b.assistant.salesman.uid").replace("c.vu", "b.assistant.supervisor.uid")
				.replace("c.wu", "b.assistant.worker.uid").replace("c.ou", "b.assistant.officer.uid")
				.replace("c.mu", "b.assistant.materialer.uid");
		condition = condition.replace("c.dr", "b.assistant.designRegion.did")
				.replace("c.dd", "b.assistant.designDepartment.did").replace("c.br", "b.assistant.businessRegion.did")
				.replace("c.bd", "b.assistant.businessDepartment.did").replace("c.sd", "b.assistant.supervisDepartment.did")
				.replace("c.wd", "b.assistant.workDepartment.did").replace("c.od", "b.assistant.officeDepartment.did")
				.replace("c.md", "b.assistant.materialDepartment.did");
		
		String from = "from AccountPO as b";
		String where = String.format("where %s", condition);
		
		hql.put("select", "select b");
		hql.put("from", from);
		hql.put("where", where);
		
		return hql;
	}

}
