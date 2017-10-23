package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.MaterialDesignerDepartmentRankDao;
import com.fanglin.report.po.MaterialDesignerDepartmentRankPO;

@Repository("materialDesignerDepartmentRankDao")
public class MaterialDesignerDepartmentRankDaoImpl extends DaoImpl<MaterialDesignerDepartmentRankPO> implements MaterialDesignerDepartmentRankDao {
	
	public MaterialDesignerDepartmentRankDaoImpl(){
		super(MaterialDesignerDepartmentRankPO.class);
	}
	
	@Override
	public MaterialDesignerDepartmentRankPO queryMaterialDesignerDepartmentRankByDeptIdInit(String deptId,int company){
		return (MaterialDesignerDepartmentRankPO) session().createCriteria(MaterialDesignerDepartmentRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq(MaterialDesignerDepartmentRankPO.COLUMN_DESIGNERDEPTID_STR, deptId))
				.add(Restrictions.eq(MaterialDesignerDepartmentRankPO.COLUMN_STATUS_STR, MaterialDesignerDepartmentRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialDesignerDepartmentRankPO> queryMaterialDesignerDepartmentRankForTop(int top,int company){
		
		Criteria criteria = session().createCriteria(MaterialDesignerDepartmentRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.ne(MaterialDesignerDepartmentRankPO.COLUMN_DESIGNERDEPTID_STR, ""))
				.add(Restrictions.eq(MaterialDesignerDepartmentRankPO.COLUMN_STATUS_STR, MaterialDesignerDepartmentRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(MaterialDesignerDepartmentRankPO.COLUMN_RANK_STR));
		
		if(top >= 0){
			criteria.setFirstResult(0).setMaxResults(top);
		}
		
		return criteria.list();
	}

}
