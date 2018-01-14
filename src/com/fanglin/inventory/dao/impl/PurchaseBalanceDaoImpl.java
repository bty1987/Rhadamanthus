package com.fanglin.inventory.dao.impl;


import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.PurchaseBalanceDao;
import com.fanglin.inventory.po.PurchaseBalancePO;

@Repository("purchaseBalanceDao")
public class PurchaseBalanceDaoImpl extends DaoImpl<PurchaseBalancePO> implements PurchaseBalanceDao{

	public PurchaseBalanceDaoImpl(){
		super(PurchaseBalancePO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<PurchaseBalancePO> queryPurchaseBalanceByPid(long pid) {
		
		return session().createCriteria(PurchaseBalancePO.class).add(Restrictions.eq(PurchaseBalancePO.COLUMN_PID_STR, pid)).list();
	}
	
}
