/**
 * @File Name		: MaterialDao.java
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
import com.fanglin.material.po.MaterialPO;
import com.fanglin.utils.Paging;

public interface MaterialDao extends Dao<MaterialPO> {

	public List<MaterialPO> pageMaterial(Paging paging, List<Filter> filters);

	public List<MaterialPO> pageMaterialByOrderId(Paging paging, List<Filter> filters, String orderId, String userId);

	public List<MaterialPO> pageMaterialForAdvance(Paging paging, List<Filter> filters, String orderId);

	public List<MaterialPO> pageMaterialPreBalance(Paging paging, List<Filter> filters, int company);

	public List<MaterialPO> queryMaterialByOrderId(String orderId);

	public MaterialPO queryMaterialByNo(String no);

	public List<Object> queryMaterialActivityByTotal(String orderId);

}
