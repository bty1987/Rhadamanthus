/**
 * @File Name		: ManifestTemplateItemDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.ManifestTemplateItemDao;
import com.fanglin.inventory.po.ManifestTemplateItemPO;

@Repository("manifestTemplateItemDao")
public class ManifestTemplateItemDaoImpl extends DaoImpl<ManifestTemplateItemPO> implements ManifestTemplateItemDao {
	
	public ManifestTemplateItemDaoImpl(){
		super(ManifestTemplateItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ManifestTemplateItemPO> queryManifestTemplateItemByMtId(long mtId) {
		return session().createCriteria(ManifestTemplateItemPO.class).createAlias("manifestTemplate", "manifestTemplate").add(Restrictions.eq(ManifestTemplateItemPO.COLUMN_MTID_STR, mtId)).list();
	}

	@Override
	public int deleteManifestTemplateItemByMtId(long mtId) {
		
		String sql = "delete from inventory.manifesttemplateitem where mtId = :mtId";
		session().createSQLQuery(sql).setLong("mtId", mtId).executeUpdate();
		
		return 0;
	}

	@Override
	public int deleteManifestTemplateItemByMtiIds(List<Long> mtiId) {
		
		String sql = "delete from inventory.manifesttemplateitem where mtiId in :mtiId";
		session().createSQLQuery(sql).setParameterList("mtiId", mtiId).executeUpdate();
		
		return 0;
	}

}
