/**
 * @File Name		: ReceiptTypeDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-5-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ReceiptTypeDao;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.utils.Paging;

@Repository("receiptTypeDao")
public class ReceiptTypeDaoImpl extends DaoImpl<ReceiptTypePO> implements ReceiptTypeDao {
	
	public ReceiptTypeDaoImpl(){
		super(ReceiptTypePO.class);
	}

	@Override
	public List<ReceiptTypePO> pageReceiptType(Paging paging, List<Filter> filters,int company) {
		
		PagingQuery<ReceiptTypePO> query = pagingQuery(paging, ReceiptTypePO.class);
		query.add(Restrictions.eq("company", company));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ReceiptTypePO> queryReceiptType(int company) {
		return session().createCriteria(ReceiptTypePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("status", ReceiptTypePO.STATUS_ENABLE_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ReceiptTypePO> queryReceiptTypeByType(short type,int company) {
		return session().createCriteria(ReceiptTypePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ReceiptTypePO.COLUMN_TYPE_STR, type)).list();
	}
	
	@Override
	public ReceiptTypePO queryReceiptTypeByNo(String no,int company) {
		return (ReceiptTypePO) session().createCriteria(ReceiptTypePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ReceiptTypePO.COLUMN_NO_STR, no)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
	}

}
