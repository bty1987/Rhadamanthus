package com.fanglin.inventory.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.AccessoriesItemDao;
import com.fanglin.inventory.po.AccessoriesItemPO;
import com.fanglin.utils.Arith;

@Repository("accessoriesItemDao")
public class AccessoriesItemDaoImpl extends DaoImpl<AccessoriesItemPO> implements AccessoriesItemDao {

	public AccessoriesItemDaoImpl() {
		super(AccessoriesItemPO.class);
	}

	@Override
	public List<?> queryAccessoriesItem(String orderId) {

		String sql = "select {acsitem.*} from inventory.accessories acs, inventory.accessoriesitem acsitem where acs.orderId = :orderId and acs.aid = acsitem.aid";

		return session().createSQLQuery(sql).addEntity("acsitem", AccessoriesItemPO.class).setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AccessoriesItemPO> queryAccessoriesItem(long aid) {
		return session().createCriteria(AccessoriesItemPO.class).add(Restrictions.eq(AccessoriesItemPO.COLUMN_AOID_STR, aid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AccessoriesItemPO> queryAccessoriesItem(List<Long> aids) {
		return session().createCriteria(AccessoriesItemPO.class).add(Restrictions.in(AccessoriesItemPO.COLUMN_AOID_STR, aids)).list();
	}

	@Override
	public int amountAccessoriesItem(String orderId, long nid) {

		String sql = "select CAST(sum(if(type = 0, ai.num, -ai.num)*ai.storenum) AS SIGNED) from inventory.accessories a, inventory.accessoriesitem ai where a.orderId = :orderId and a.aid = ai.aid and nid =:nid and a.status not in (3, 4)";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setLong("nid", nid).uniqueResult();

		return count == null ? 0 : Arith.div(count.intValue(), 1000000);
	}

}
