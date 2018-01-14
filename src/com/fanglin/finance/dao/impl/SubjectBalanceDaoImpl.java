/**
 * @File Name		: SubjectBalanceDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-4-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.dao.SubjectBalanceDao;
import com.fanglin.finance.po.SubjectBalancePO;
import com.fanglin.utils.Paging;

@Repository("subjectBalanceDao")
public class SubjectBalanceDaoImpl extends DaoImpl<SubjectBalancePO> implements SubjectBalanceDao {

	public SubjectBalanceDaoImpl(){
		super(SubjectBalancePO.class);
	}

	@Override
	public List<SubjectBalancePO> pageSubjectBalance(Paging paging, List<Filter> filters) {
		
		PagingQuery<SubjectBalancePO> query = pagingQuery(paging, SubjectBalancePO.class);
		
		queryFilterExcute(query, filters);
		
		query.asc(SubjectBalancePO.COLUMN_PERIOD_STR);
		
		return query.list();
	}

	@Override
	public List<SubjectBalancePO> querySubjectBalance(List<Filter> filters) {
		
		PagingQuery<SubjectBalancePO> query = pagingQuery(new Paging(), SubjectBalancePO.class);
		
		queryFilterExcute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SubjectBalancePO> querySubjectBalanceForInit() {
		return session().createCriteria(SubjectBalancePO.class).add(Restrictions.eq(SubjectBalancePO.COLUMN_STATUS_STR, SubjectBalancePO.STATUS_INIT_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SubjectBalancePO> querySubjectBalanceBySubjectCode(String code) {
		return session().createCriteria(SubjectBalancePO.class).createAlias("subject", "subject").add(Restrictions.eq(SubjectBalancePO.COLUMN_SUBJECT_CODE_STR, code)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SubjectBalancePO> querySubjectBalanceBySubjectCodeGePeriod(String code, String period) {
		return session().createCriteria(SubjectBalancePO.class).createAlias("subject", "subject").add(Restrictions.eq(SubjectBalancePO.COLUMN_SUBJECT_CODE_STR, code)).add(Restrictions.ge(SubjectBalancePO.COLUMN_PERIOD_STR, period)).list();
	}

	@Override
	public int expireSubjectBalance() {
		
		String sql = "update finance.subjectbalance set status = :expire where status = :init";
		session().createSQLQuery(sql).setShort("expire", (short) SubjectBalancePO.STATUS_EXPIRED_INT).setShort("init", (short) SubjectBalancePO.STATUS_INIT_INT).executeUpdate();
		
		return 0;
	}
	
	@Override
	public int deleteSubjectBalanceBySId(long sid) {
		
		String sql = "delete from finance.subjectbalance where sid = :sid";
		session().createSQLQuery(sql).setLong("sid", sid).executeUpdate();
		
		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		query.alias("subject", "subject");
		
	}
	
}
