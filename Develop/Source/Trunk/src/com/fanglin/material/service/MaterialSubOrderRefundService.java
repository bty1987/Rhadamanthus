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

import com.fanglin.material.vo.MaterialSubOrderRefundVO;

public interface MaterialSubOrderRefundService {
	
	public List<MaterialSubOrderRefundVO> queryMaterialSubOrderRefundByMsoIdAIdents(long msoId, List<Integer> idents);
	
	public boolean cancelMaterialSubOrderRefundForModel(long msorId);
	
	public boolean cancelMaterialSubOrderRefundForPackage(List<Long> msorIds, long msoId);

}
