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
	public MaterialDesignerRankPO queryMaterialDesignerRankByDesignerIdInit(String designerId,int company){
		return (MaterialDesignerRankPO) session().createCriteria(MaterialDesignerRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq(MaterialDesignerRankPO.COLUMN_DESIGNERID_STR, designerId))
				.add(Restrictions.eq(MaterialDesignerRankPO.COLUMN_STATUS_STR, MaterialDesignerRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MaterialDesignerRankPO> queryMaterialDesignerRankForTop(int top,int company){
		
		Criteria criteria = session().createCriteria(MaterialDesignerRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.ne(MaterialDesignerRankPO.COLUMN_DESIGNERID_STR, ""))
				.add(Restrictions.eq(MaterialDesignerRankPO.COLUMN_STATUS_STR, MaterialDesignerRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(MaterialDesignerRankPO.COLUMN_RANK_STR));
		
		if(top >= 0){
			criteria.setFirstResult(0).setMaxResults(top);
		}
		
		return criteria.list();
	}
	
	@Override
	public List<?> queryMaterialDesignerRankForPlaceByDesignerId(String designerId,int company) {
		
		int status = MaterialDesignerRankPO.STATUS_TYPE_INIT_INT;
		
		String sql = "select b.rank, (select count(1)+1 from report.materialdesignerrank a where a.status =:statusA and b.status =:statusB and a.rank > b.rank and a.company =:companyA and b.company =:companyB) place from report.materialdesignerrank b where b.status =:statusC and b.designerId =:designerId and b.company =:companyC";
		
		return session().createSQLQuery(sql).setInteger("statusA", status).setInteger("statusB", status).setInteger("statusC", status).setInteger("companyA", company).setInteger("companyB", company).setInteger("companyC", company).setString("designerId", designerId).list();
	}

}
