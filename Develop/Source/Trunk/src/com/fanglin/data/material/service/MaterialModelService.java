/**
 * @File Name		: MaterialModelService.java
 * @Package   	: com.fanglin.service.material
 * @Version		: 1.0
 * @Date			: 2014-8-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.MaterialModelVO;
import com.fanglin.utils.Paging;

public interface MaterialModelService {
	
	public void pageMaterialModel(Paging paging, List<Filter> filters, String userId,int company) throws FLException;
	
	public List<MaterialModelVO> queryMaterialModel();
	
	public List<MaterialModelVO> queryMaterialModel(List<Filter> filters);
	
	public MaterialModelVO queryMaterialModelById(MaterialModelVO materialModelVO);
	
	public MaterialModelVO queryMaterialModelByMmId(MaterialModelVO materialModelVO);
	
	public MaterialModelVO queryMaterialModelByNo(MaterialModelVO materialModelVO,int company);
	
	public List<MaterialModelVO> queryMaterialModelForAllByName(MaterialModelVO materialModelVO,int company);
	
	public List<MaterialModelVO> queryMaterialModelForAllByNo(MaterialModelVO materialModelVO);
	
	public int addMaterialModel(MaterialModelVO materialModelVO,int company) throws FLException;
	
	public void updateMaterialModel(MaterialModelVO materialModelVO);
	
	public void updateMaterialModelForStatus(MaterialModelVO materialModelVO);
	
	public void updateMaterialModelForAdvance(MaterialModelVO materialModelVO);
	
	public void deleteMaterialModel(MaterialModelVO materialModelVO);
	
	public void deleteMaterialModelById(int materialModelId);
	
	public void deleteMaterialModelByIds(List<String> ids);
	
}
