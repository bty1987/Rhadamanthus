/**
 * @File Name		: ManifestItemDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.ManifestItemDao;
import com.fanglin.inventory.po.ManifestItemPO;

@Repository("manifestItemDao")
public class ManifestItemDaoImpl extends DaoImpl<ManifestItemPO> implements ManifestItemDao {
	
	public ManifestItemDaoImpl(){
		super(ManifestItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ManifestItemPO> queryManifestItemByMId(long mId) {
		return session().createCriteria(ManifestItemPO.class).add(Restrictions.eq(ManifestItemPO.COLUMN_MID_STR, mId)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ManifestItemPO> queryManifestItemBySiid(long siid) {
		
		return session().createCriteria(ManifestItemPO.class).add(Restrictions.eq(ManifestItemPO.COLUMN_SIID_STR, siid)).list();
	}
	
	@Override
	public List<ManifestItemPO> queryManifestItemBySiids(List<Long> siids) {
		
		List<ManifestItemPO> purchaseItemPOs = new ArrayList<ManifestItemPO>();

		for(Long siid : siids){
			purchaseItemPOs.addAll(queryManifestItemBySiid(siid));
		}

		return purchaseItemPOs;
	}

}
