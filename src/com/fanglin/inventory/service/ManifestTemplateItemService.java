/**
 * @File Name		: ManifestTemplateItemService.java
 * @Package   	: com.fanglin.inventory.service
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.inventory.vo.ManifestTemplateItemVO;
import com.fanglin.inventory.vo.ManifestTemplateVO;

public interface ManifestTemplateItemService {
	
	public List<ManifestTemplateItemVO> queryManifestTemplateItemByMtid(ManifestTemplateVO manifestTemplateVO);
	
	public List<GoodsVO> queryGoodsByMtid(ManifestTemplateVO manifestTemplateVO);
	
	public int addManifestTemplateItem(ManifestTemplateVO manifestTemplateVO, List<Long> miIds);
	
	public int deleteManifestTemplateItem(List<Long> mtiIds);
	
}
