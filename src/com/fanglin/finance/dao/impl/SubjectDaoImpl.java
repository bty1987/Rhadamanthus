/**
 * @File Name		: SubjectDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.dao.SubjectDao;
import com.fanglin.finance.po.SubjectPO;
import com.fanglin.utils.Paging;

@Repository("subjectDao")
public class SubjectDaoImpl extends DaoImpl<SubjectPO> implements SubjectDao {

	public SubjectDaoImpl(){
		super(SubjectPO.class);
	}

	@Override
	public List<SubjectPO> pageSubject(Paging paging, List<Filter> filters) {
		
		PagingQuery<SubjectPO> query = pagingQuery(paging, SubjectPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SubjectPO> querySubject() {
		return session().createCriteria(SubjectPO.class).addOrder(Order.asc(SubjectPO.COLUMN_CODE_STR)).list();
	}

	@Override
	public List<SubjectPO> querySubjectByNameOCode(String name, String code) {
		
		PagingQuery<SubjectPO> query = pagingQuery(new Paging(1, 10), SubjectPO.class);
		
		query.add(Restrictions.or(Restrictions.ilike(SubjectPO.COLUMN_CODE_STR, code, MatchMode.ANYWHERE), Restrictions.ilike(SubjectPO.COLUMN_NAME_STR, name, MatchMode.ANYWHERE)));
		query.add(Restrictions.eq(SubjectPO.COLUMN_STATUS_STR, SubjectPO.STATUS_ENABLE_INT));
		query.add(Restrictions.eq(SubjectPO.COLUMN_LIMITS_STR, SubjectPO.LIMITS_DISABLED_INT));
		
		return query.asc(SubjectPO.COLUMN_CODE_STR).list();
	}

	@Override
	public SubjectPO querySubjectByCode(String code) {
		return (SubjectPO) session().createCriteria(SubjectPO.class).add(Restrictions.eq(SubjectPO.COLUMN_CODE_STR, code)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
	}
	
}
