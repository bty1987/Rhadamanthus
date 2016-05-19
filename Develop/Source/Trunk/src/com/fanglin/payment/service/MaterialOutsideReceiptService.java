/**
 * @File Name		: MaterialOutsideReceiptService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2015-11-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service;

import com.fanglin.payment.vo.MaterialOutsideReceiptVO;

import java.util.List;

public interface MaterialOutsideReceiptService {
	
	public List<MaterialOutsideReceiptVO> queryMaterialOutsideReceiptByMorIds(List<Long> morIds);

}
