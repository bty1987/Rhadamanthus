/**
 * @File Name		: MaterialModel.java
 * @Package   	: com.fanglin.dao.material
 * @Version		: 1.0
 * @Date			: 2014-8-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.material.po.MaterialModelPO;
import com.fanglin.utils.Paging;

public interface MaterialModelDao extends Dao<MaterialModelPO> {
	
	public List<MaterialModelPO> queryPageMaterialModel(Paging paging, List<FilterVO> filters);
	
	public List<MaterialModelPO> queryPageMaterialModelByBrandIds(Paging paging, List<FilterVO> filters, List<Integer> brandIds);
	
	public List<MaterialModelPO> queryMaterialModel(List<FilterVO> filters);
	
	public List<MaterialModelPO> queryMaterialModelByName(String materialModelName, int limit);
	
	public List<MaterialModelPO> queryMaterialModelByNo(String materiModelNo, int limit);
	
	public MaterialModelPO queryMaterialModelByNo(String materiModelNo);
	
	public MaterialModelPO queryMaterialModelByNameBrand(String materialModelNo, long bId);

	public MaterialModelPO queryMaterialModelByNoBrand(String materialModelNo, long bId);

}
