/**
 * @File Name		: MaterialItemDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.material.po.MaterialItemPO;

public interface MaterialItemDao extends Dao<MaterialItemPO> {

	public List<MaterialItemPO> queryMaterialItemByMids(List<Long> mids);

	public List<MaterialItemPO> queryMaterialItemByMid(long mid);

	public List<MaterialItemPO> queryMaterialItemByMidNotRefund(long mid);

	public MaterialItemPO queryMaterialItemByMiid(long msoiId);

	public List<MaterialItemPO> queryMaterialItemByName(long mid, String name, int limit);

	public List<MaterialItemPO> queryMaterialItemByNo(long mid, String msoNo, int limit);

	public int amountMaterialItemForTotal(long mid);

	public void deleteMaterialItemByMid(long mid);

}
