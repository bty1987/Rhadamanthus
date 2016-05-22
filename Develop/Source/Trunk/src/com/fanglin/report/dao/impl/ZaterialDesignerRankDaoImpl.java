/**
 * @File Name		: ZaterialDesignerRankDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.ZaterialDesignerRankDao;
import com.fanglin.report.po.ZaterialDesignerRankPO;

@Repository("zaterialDesignerRankDao")
public class ZaterialDesignerRankDaoImpl extends DaoImpl<ZaterialDesignerRankPO> implements ZaterialDesignerRankDao {
	
	public ZaterialDesignerRankDaoImpl(){
		super(ZaterialDesignerRankPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ZaterialDesignerRankPO> queryZaterialDesignerRank() {
		return session().createCriteria(ZaterialDesignerRankPO.class).list();
	}

	@Override
	public ZaterialDesignerRankPO queryZaterialDesignerRankByDesignerIdInit(String designerId){
		return (ZaterialDesignerRankPO) session().createCriteria(ZaterialDesignerRankPO.class)
				.add(Restrictions.eq(ZaterialDesignerRankPO.COLUMN_DESIGNERID_STR, designerId))
				.add(Restrictions.eq(ZaterialDesignerRankPO.COLUMN_STATUS_STR, ZaterialDesignerRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ZaterialDesignerRankPO> queryZaterialDesignerRankForTop(int top){
		
		Criteria criteria = session().createCriteria(ZaterialDesignerRankPO.class)
				.add(Restrictions.ne(ZaterialDesignerRankPO.COLUMN_DESIGNERID_STR, ""))
				.add(Restrictions.eq(ZaterialDesignerRankPO.COLUMN_STATUS_STR, ZaterialDesignerRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(ZaterialDesignerRankPO.COLUMN_RANK_STR));
		
		if(top >= 0){
			criteria.setFirstResult(0).setMaxResults(top);
		}
		
		return criteria.list();
	}

	@Override
	public List<?> queryZaterialDesignerRankForPlaceByDesignerId(String designerId) {
		
		int status = ZaterialDesignerRankPO.STATUS_TYPE_INIT_INT;
		
		String sql = "select b.rank, (select count(1)+1 from platform.zaterialdesignerrank a where a.status =:statusA and b.status =:statusB and a.rank > b.rank) place from platform.zaterialdesignerrank b where b.status =:statusC and b.designerId =:designerId";
		
		return session().createSQLQuery(sql).setInteger("statusA", status).setInteger("statusB", status).setInteger("statusC", status).setString("designerId", designerId).list();
	}
}
