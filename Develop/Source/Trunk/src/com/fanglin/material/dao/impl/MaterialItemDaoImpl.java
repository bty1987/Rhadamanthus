/**
 * @File Name		: MaterialItemDaoImpl.java
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
import com.fanglin.material.dao.MaterialItemDao;
import com.fanglin.material.po.MaterialItemPO;

@Repository("materialItemDao")
public class MaterialItemDaoImpl extends DaoImpl<MaterialItemPO> implements MaterialItemDao {
	
	public MaterialItemDaoImpl(){
		super(MaterialItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialItemPO> queryMaterialItemByMids(List<Long> mids){
		return session().createCriteria(MaterialItemPO.class).add(Restrictions.in(MaterialItemPO.COLUMN_MID_STR, mids)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialItemPO> queryMaterialItemByMid(long mid){
		return session().createCriteria(MaterialItemPO.class)
				.add(Restrictions.eq(MaterialItemPO.COLUMN_MID_STR, mid))
				.add(Restrictions.ne(MaterialItemPO.COLUMN_STATUS_STR, MaterialItemPO.STATUS_TYPE_DELETE_INT))
				.add(Restrictions.ne(MaterialItemPO.COLUMN_REFUNDSTATUS_STR, MaterialItemPO.REFUNDSTATUS_TYPE_REJECT_INT))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialItemPO> queryMaterialItemByMidNotRefund(long mid){
		return session().createCriteria(MaterialItemPO.class)
				.add(Restrictions.eq(MaterialItemPO.COLUMN_MID_STR, mid))
				.add(Restrictions.ne(MaterialItemPO.COLUMN_STATUS_STR, MaterialItemPO.STATUS_TYPE_DELETE_INT))
				.add(Restrictions.ne(MaterialItemPO.COLUMN_REFUNDSTATUS_STR, MaterialItemPO.REFUNDSTATUS_TYPE_REJECT_INT))
				.list();
	}

	@Override
	public MaterialItemPO queryMaterialItemByMiid(long miid) {
		return (MaterialItemPO) session().createCriteria(MaterialItemPO.class).add(Restrictions.eq(MaterialItemPO.COLUMN_MIID_STR, miid)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialItemPO> queryMaterialItemByName(long mid, String name, int limit) {
		return session().createCriteria(MaterialItemPO.class)
				.add(Restrictions.eq(MaterialItemPO.COLUMN_MID_STR, mid))
				.add(Restrictions.ilike(MaterialItemPO.COLUMN_NAME_STR, name, MatchMode.ANYWHERE))
				.setMaxResults(limit).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialItemPO> queryMaterialItemByNo(long mid, String msoNo, int limit) {
		return session().createCriteria(MaterialItemPO.class)
				.add(Restrictions.eq(MaterialItemPO.COLUMN_MID_STR, mid))
				.add(Restrictions.ilike(MaterialItemPO.COLUMN_NO_STR, msoNo, MatchMode.ANYWHERE))
				.setMaxResults(limit).list();
	}

	@Override
	public void deleteMaterialItemByMid(long mid){
		String sql= "delete from material.materialitem where mid = ?";
		
		session().createSQLQuery(sql).setLong(0, mid).executeUpdate();
	}
}
