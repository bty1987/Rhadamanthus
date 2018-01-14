/**
 * @File Name		: ManifestTemplateItemDao.java
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
import com.fanglin.inventory.po.ManifestTemplateItemPO;

public interface ManifestTemplateItemDao extends Dao<ManifestTemplateItemPO> {
	
	public List<ManifestTemplateItemPO> queryManifestTemplateItemByMtId(long mtId);
	
	public int deleteManifestTemplateItemByMtId(long mtId);
	
	public int deleteManifestTemplateItemByMtiIds(List<Long> mtiIds);

}
