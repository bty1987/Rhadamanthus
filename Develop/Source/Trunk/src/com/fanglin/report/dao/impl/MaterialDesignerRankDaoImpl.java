/**
 * @File Name		: MaterialDesignerRankDaoImpl.java
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
import com.fanglin.report.dao.MaterialDesignerRankDao;
import com.fanglin.report.po.MaterialDesignerRankPO;

@Repository("materialDesignerRankDao")
public class MaterialDesignerRankDaoImpl extends DaoImpl<MaterialDesignerRankPO> implements MaterialDesignerRankDao {
	
	public MaterialDesignerRankDaoImpl(){
		super(MaterialDesignerRankPO.class);
	}
	
	@Override
	public MaterialDesignerRankPO queryMaterialDesignerRankByDesignerIdInit(String designerId){
		return (MaterialDesignerRankPO) session().createCriteria(MaterialDesignerRankPO.class)
				.add(Restrictions.eq(MaterialDesignerRankPO.COLUMN_DESIGNERID_STR, designerId))
				.add(Restrictions.eq(MaterialDesignerRankPO.COLUMN_STATUS_STR, MaterialDesignerRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MaterialDesignerRankPO> queryMaterialDesignerRankForTop(int top){
		
		Criteria criteria = session().createCriteria(MaterialDesignerRankPO.class)
				.add(Restrictions.ne(MaterialDesignerRankPO.COLUMN_DESIGNERID_STR, ""))
				.add(Restrictions.eq(MaterialDesignerRankPO.COLUMN_STATUS_STR, MaterialDesignerRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(MaterialDesignerRankPO.COLUMN_RANK_STR));
		
		if(top >= 0){
			criteria.setFirstResult(0).setMaxResults(top);
		}
		
		return criteria.list();
	}
	
	@Override
	public List<?> queryMaterialDesignerRankForPlaceByDesignerId(String designerId) {
		
		int status = MaterialDesignerRankPO.STATUS_TYPE_INIT_INT;
		
		String sql = "select b.rank, (select count(1)+1 from platform.materialdesignerrank a where a.status =:statusA and b.status =:statusB and a.rank > b.rank) place from platform.materialdesignerrank b where b.status =:statusC and b.designerId =:designerId";
		
		return session().createSQLQuery(sql).setInteger("statusA", status).setInteger("statusB", status).setInteger("statusC", status).setString("designerId", designerId).list();
	}

}
