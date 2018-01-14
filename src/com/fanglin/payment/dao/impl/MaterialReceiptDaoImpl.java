/**
 * @File Name		: MaterialReceiptDaoImpl.java
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
import com.fanglin.payment.dao.MaterialReceiptDao;
import com.fanglin.payment.po.MaterialReceiptPO;

@Repository("materialReceiptDao")
public class MaterialReceiptDaoImpl extends DaoImpl<MaterialReceiptPO> implements MaterialReceiptDao {
	
	public MaterialReceiptDaoImpl(){
		super(MaterialReceiptPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialReceiptPO> queryMaterialReceiptByMrIds(List<Long> mrIds) {
		return session().createCriteria(MaterialReceiptPO.class).add(Restrictions.in(MaterialReceiptPO.COLUMN_MRID_STR, mrIds)).list();
	}

}
