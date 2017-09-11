/**
 * @File Name		: MaterialSubOrderItemDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.material.dao.MaterialSubOrderItemDao;
import com.fanglin.material.po.MaterialSubOrderItemPO;

@Repository("materialSubOrderItemDao")
public class MaterialSubOrderItemDaoImpl extends DaoImpl<MaterialSubOrderItemPO> implements MaterialSubOrderItemDao {
	
	public MaterialSubOrderItemDaoImpl(){
		super(MaterialSubOrderItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoIds(List<Long> msoIds){
		return session().createCriteria(MaterialSubOrderItemPO.class).add(Restrictions.in(MaterialSubOrderItemPO.COLUMN_MSOID_STR, msoIds)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoId(long msoId){
		return session().createCriteria(MaterialSubOrderItemPO.class)
				.add(Restrictions.eq(MaterialSubOrderItemPO.COLUMN_MSOID_STR, msoId))
				.add(Restrictions.ne(MaterialSubOrderItemPO.COLUMN_STATUS_STR, MaterialSubOrderItemPO.STATUS_TYPE_DELETE_INT))
				.add(Restrictions.ne(MaterialSubOrderItemPO.COLUMN_REFUNDSTATUS_STR, MaterialSubOrderItemPO.REFUNDSTATUS_TYPE_REJECT_INT))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoIdNotRefund(long msoId){
		return session().createCriteria(MaterialSubOrderItemPO.class)
				.add(Restrictions.eq(MaterialSubOrderItemPO.COLUMN_MSOID_STR, msoId))
				.add(Restrictions.ne(MaterialSubOrderItemPO.COLUMN_STATUS_STR, MaterialSubOrderItemPO.STATUS_TYPE_DELETE_INT))
				.add(Restrictions.ne(MaterialSubOrderItemPO.COLUMN_REFUNDSTATUS_STR, MaterialSubOrderItemPO.REFUNDSTATUS_TYPE_REJECT_INT))
				.list();
	}

	@Override
	public MaterialSubOrderItemPO queryMaterialSubOrderItemByMsoiId(long msoiId) {
		return (MaterialSubOrderItemPO) session().createCriteria(MaterialSubOrderItemPO.class).add(Restrictions.eq(MaterialSubOrderItemPO.COLUMN_MSOIID_STR, msoiId)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByName(long msoId, String name, int limit) {
		return session().createCriteria(MaterialSubOrderItemPO.class)
				.add(Restrictions.eq(MaterialSubOrderItemPO.COLUMN_MSOID_STR, msoId))
				.add(Restrictions.ilike(MaterialSubOrderItemPO.COLUMN_MATERIALMODELNAME_STR, name, MatchMode.ANYWHERE))
				.setMaxResults(limit).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByNo(long msoId, String msoNo, int limit) {
		return session().createCriteria(MaterialSubOrderItemPO.class)
				.add(Restrictions.eq(MaterialSubOrderItemPO.COLUMN_MSOID_STR, msoId))
				.add(Restrictions.ilike(MaterialSubOrderItemPO.COLUMN_MATERIALMODELNO_STR, msoNo, MatchMode.ANYWHERE))
				.setMaxResults(limit).list();
	}

	@Override
	public void deleteMaterialSubOrderItemByMsoId(long msoId){
		String sql= "delete from material.materialsuborderitem where msoId = ?";
		
		session().createSQLQuery(sql).setLong(0, msoId).executeUpdate();
	}
}
