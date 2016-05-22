/**
 * @File Name		: MaterialOutsideReceiptDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-25
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
import com.fanglin.payment.dao.MaterialOutsideReceiptDao;
import com.fanglin.payment.po.MaterialOutsideReceiptPO;

@Repository("materialOutsideReceiptDao")
public class MaterialOutsideReceiptDaoImpl extends DaoImpl<MaterialOutsideReceiptPO> implements MaterialOutsideReceiptDao {
	
	public MaterialOutsideReceiptDaoImpl(){
		super(MaterialOutsideReceiptPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialOutsideReceiptPO> queryMaterialOutsideReceiptByMorIds(List<Long> morIds) {
		return session().createCriteria(MaterialOutsideReceiptPO.class).add(Restrictions.in(MaterialOutsideReceiptPO.COLUMN_MORID_STR, morIds)).list();
	}
	
}
