/**
 * @File Name		: MaterialRefundDao.java
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
import com.fanglin.core.vo.Filter;
import com.fanglin.material.po.MaterialRefundPO;
import com.fanglin.utils.Paging;

public interface MaterialRefundDao extends Dao<MaterialRefundPO> {
	
	public List<MaterialRefundPO> pageMaterialRefundByMid(Paging paging, List<Filter> filters, long mid);
	
	public List<MaterialRefundPO> queryMaterialRefundByMid(long mid);
	
	public List<MaterialRefundPO> queryMaterialRefundByMidIdents(long mid, List<Integer> idents);
	
	public MaterialRefundPO queryMaterialRefundByMiid(long miid);
	
	public List<MaterialRefundPO> queryMaterialRefundByMpId(long mpId);

}
