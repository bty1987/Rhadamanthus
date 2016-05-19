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

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.finance.dao.VoucherDao;
import com.fanglin.finance.po.VoucherPO;

@Repository("voucherDao")
public class VoucherDaoImpl extends DaoImpl<VoucherPO> implements VoucherDao {

	public VoucherDaoImpl(){
		super(VoucherPO.class);
	}

	@Override
	public VoucherPO merge(VoucherPO voucherPO) {
		return (VoucherPO) financeSession().merge(voucherPO);
	}

}
