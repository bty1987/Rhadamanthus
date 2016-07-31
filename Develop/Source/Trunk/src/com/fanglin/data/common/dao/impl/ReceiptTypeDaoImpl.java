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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.common.dao.ReceiptTypeDao;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.utils.Paging;

@Repository("receiptTypeDao")
public class ReceiptTypeDaoImpl extends DaoImpl<ReceiptTypePO> implements ReceiptTypeDao {
	
	public ReceiptTypeDaoImpl(){
		super(ReceiptTypePO.class);
	}

	@Override
	public List<ReceiptTypePO> pageReceiptType(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<ReceiptTypePO> query = pagingQuery(paging, ReceiptTypePO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ReceiptTypePO> queryReceiptType() {
		return session().createCriteria(ReceiptTypePO.class).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ReceiptTypePO> queryReceiptTypeByType(short type) {
		return session().createCriteria(ReceiptTypePO.class).add(Restrictions.eq(ReceiptTypePO.COLUMN_TYPE_STR, type)).list();
	}
	
	@Override
	public ReceiptTypePO queryReceiptTypeByKey(String key) {
		return (ReceiptTypePO) session().createCriteria(ReceiptTypePO.class).add(Restrictions.eq(ReceiptTypePO.COLUMN_KEY_STR, key)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
	}

}
