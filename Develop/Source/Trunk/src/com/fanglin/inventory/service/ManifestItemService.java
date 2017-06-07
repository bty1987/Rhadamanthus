/**
 * @File Name		: ManifestItemService.java
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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;

public interface ManifestItemService {
	
	public List<ManifestItemVO> queryManifestItemByMId(ManifestVO manifestVO);
	
	public List<ManifestItemVO> queryManifestItemBySiid(ManifestItemVO manifestItemVO);
	
	public List<ManifestItemVO> queryManifestItemBySiids(List<Long> siids);
	
	public int addManifestItem(ManifestVO manifestVO, ManifestItemVO manifestItemVO) throws FLException;
	
	public int updateManifestItem(ManifestVO manifestVO, ManifestItemVO manifestItemVO) throws FLException;
	
	public int deleteManifestItem(ManifestVO manifestVO, ManifestItemVO manifestItemVO) throws FLException;

}
