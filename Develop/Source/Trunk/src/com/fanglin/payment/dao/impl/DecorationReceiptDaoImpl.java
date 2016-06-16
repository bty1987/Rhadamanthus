/**
 * @File Name		: DecorationReceiptDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.DecorationReceiptDao;
import com.fanglin.payment.po.DecorationReceiptPO;

@Repository("decorationReceiptDao")
public class DecorationReceiptDaoImpl extends DaoImpl<DecorationReceiptPO> implements DecorationReceiptDao {
	
	public DecorationReceiptDaoImpl(){
		super(DecorationReceiptPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationReceiptPO> queryDecorationReceiptByDrIds(List<Long> drIds) {
		return session().createCriteria(DecorationReceiptPO.class).add(Restrictions.in(DecorationReceiptPO.COLUMN_DRID_STR, drIds)).list();
	}

}
