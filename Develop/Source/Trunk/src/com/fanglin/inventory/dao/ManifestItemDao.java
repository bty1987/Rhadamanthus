/**
 * @File Name		: ManifestItemDao.java
 * @Package   	: com.fanglin.inventory.dao
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.ManifestItemPO;

public interface ManifestItemDao extends Dao<ManifestItemPO> {
	
	public List<ManifestItemPO> queryManifestItemByMId(long mId);
	
	public List<ManifestItemPO> queryManifestItemBySiids(List<Long> siids);
	
}
