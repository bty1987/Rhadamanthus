/**
 * @File Name		: MaterialSubOrderRefundService.java
 * @Package   	: com.fanglin.service.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service;

import java.util.List;

import com.fanglin.material.vo.MaterialRefundVO;

public interface MaterialRefundService {
	
	public List<MaterialRefundVO> queryMaterialRefundByMidAIdents(long mid, List<Integer> idents);

}
