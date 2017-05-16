package com.fanglin.inventory.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.RefundsDao;
import com.fanglin.inventory.po.RefundsPO;

@Repository("refundsDao")
public class RefundsDaoImpl extends DaoImpl<RefundsPO> implements RefundsDao{

}
