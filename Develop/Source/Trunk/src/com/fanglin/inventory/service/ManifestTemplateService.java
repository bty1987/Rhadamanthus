/**
 * @File Name		: ManifestTemplateService.java
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
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.ManifestTemplateVO;
import com.fanglin.utils.Paging;

public interface ManifestTemplateService {
	
	public void pageManifestTemplate(Paging paging, List<Filter> filters,int company);
	
	public List<ManifestTemplateVO> queryManifestTemplate();
	
	public int addManifestTemplate(ManifestTemplateVO manifestTemplateVO,int company) throws FLException;
	
	public int updateManifestTemplate(ManifestTemplateVO manifestTemplateVO) throws FLException;
	
	public int updateManifestTemplateForStatus(ManifestTemplateVO manifestTemplateVO) throws FLException;
	
	public int deleteManifestTemplate(ManifestTemplateVO manifestTemplateVO);

}
