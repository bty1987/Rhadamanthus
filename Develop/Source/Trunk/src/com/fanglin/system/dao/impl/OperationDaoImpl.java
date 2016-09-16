/**
 * @File Name		: OperationDaoImpl.java
 * @Package   	: com.fanglin.system.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-4-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.OperationDao;
import com.fanglin.system.po.OperationPO;
import com.fanglin.utils.Paging;

@Repository("operationDao")
public class OperationDaoImpl extends DaoImpl<OperationPO> implements OperationDao {

	public OperationDaoImpl(){
		super(OperationPO.class);
	}

	@Override
	public List<OperationPO> pageOperation(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<OperationPO> query = pagingQuery(paging, OperationPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OperationPO> queryOperation() {
		return session().createCriteria(OperationPO.class).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OperationPO> queryOperationBySystem(short system) {
		return session().createCriteria(OperationPO.class).add(Restrictions.eq("system", system)).list();
	}

	@Override
	public OperationPO queryOperationByOperation(String operation) {
		return (OperationPO) session().createCriteria(OperationPO.class).add(Restrictions.eq(OperationPO.COLUMN_OPERATION_STR, operation)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
	}

}
