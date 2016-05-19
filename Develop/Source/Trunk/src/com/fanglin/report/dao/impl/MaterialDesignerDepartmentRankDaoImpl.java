/**
 * @File Name		: MaterialDesignerDepartmentRankDaoImpl.java
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
import com.fanglin.report.dao.MaterialDesignerDepartmentRankDao;
import com.fanglin.report.po.MaterialDesignerDepartmentRankPO;

@Repository("materialDesignerDepartmentRankDao")
public class MaterialDesignerDepartmentRankDaoImpl extends DaoImpl<MaterialDesignerDepartmentRankPO> implements MaterialDesignerDepartmentRankDao {
	
	public MaterialDesignerDepartmentRankDaoImpl(){
		super(MaterialDesignerDepartmentRankPO.class);
	}
	
	@Override
	public MaterialDesignerDepartmentRankPO queryMaterialDesignerDepartmentRankByDeptIdInit(String deptId){
		return (MaterialDesignerDepartmentRankPO) session().createCriteria(MaterialDesignerDepartmentRankPO.class)
				.add(Restrictions.eq(MaterialDesignerDepartmentRankPO.COLUMN_DESIGNERDEPTID_STR, deptId))
				.add(Restrictions.eq(MaterialDesignerDepartmentRankPO.COLUMN_STATUS_STR, MaterialDesignerDepartmentRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialDesignerDepartmentRankPO> queryMaterialDesignerDepartmentRankForTop(int top){
		
		Criteria criteria = session().createCriteria(MaterialDesignerDepartmentRankPO.class)
				.add(Restrictions.ne(MaterialDesignerDepartmentRankPO.COLUMN_DESIGNERDEPTID_STR, ""))
				.add(Restrictions.eq(MaterialDesignerDepartmentRankPO.COLUMN_STATUS_STR, MaterialDesignerDepartmentRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(MaterialDesignerDepartmentRankPO.COLUMN_RANK_STR));
		
		if(top >= 0){
			criteria.setFirstResult(0).setMaxResults(top);
		}
		
		return criteria.list();
	}

}
