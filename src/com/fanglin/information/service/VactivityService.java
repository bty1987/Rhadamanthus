/**
 * @File Name		: VactivityService.java
 * @Package   	: com.fanglin.information.service
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.VactivityVO;
import com.fanglin.utils.Paging;

public interface VactivityService {
	
	public void pageVactivity(Paging paging, List<Filter> filters);
	
	public List<VactivityVO> queryVactivity();

}
