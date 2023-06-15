/**
 * @File Name		: ManifestDao.java
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
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.utils.Paging;

public interface ManifestDao extends Dao<ManifestPO> {

	public List<ManifestPO> pageManifest(Paging paging, List<Filter> filters, int company);

	public List<ManifestPO> queryManifest(List<Filter> filters);

	public ManifestPO queryManifest(String code);

}
