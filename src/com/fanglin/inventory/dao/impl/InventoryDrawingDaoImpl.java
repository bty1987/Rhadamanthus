package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.InventoryDrawingDao;
import com.fanglin.inventory.po.InventoryDrawingPO;

@Repository("inventoryDrawingDao")
public class InventoryDrawingDaoImpl extends DaoImpl<InventoryDrawingPO> implements InventoryDrawingDao {

	public InventoryDrawingDaoImpl() {
		super(InventoryDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<InventoryDrawingPO> queryInventoryDrawing(Long sid) {
		return session().createCriteria(InventoryDrawingPO.class).add(Restrictions.eq("sid", sid)).list();
	}

	@Override
	public int deleteInventoryDrawing(long idid) {

		String sql = "delete from inventory.inventorydrawing where idid = :idid";
		session().createSQLQuery(sql).setLong("idid", idid).executeUpdate();

		return 0;
	}

}
