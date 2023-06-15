package com.fanglin.payment.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.ProxyReceiptDao;
import com.fanglin.payment.po.ProxyReceiptPO;

@Repository("proxyReceiptDao")
public class ProxyReceiptDaoImpl extends DaoImpl<ProxyReceiptPO> implements ProxyReceiptDao {

	public ProxyReceiptDaoImpl() {
		super(ProxyReceiptPO.class);
	}
}
