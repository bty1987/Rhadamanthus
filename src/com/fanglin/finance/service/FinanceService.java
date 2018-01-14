/**
 * @File Name		: DecorationFinanceService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2015-12-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.payment.po.MaterialReceiptPO;
import com.fanglin.personel.po.UserPO;

public interface FinanceService {
	
	public int buildAdvanceFinance(DecorationPO decorationPO, AdvanceReceiptPO advanceReceiptPO,  UserPO poster) throws FLException;
	
	public int buildDecorationFinance(DecorationPO decorationPO, DecorationReceiptPO decorationReceiptPO,  UserPO poster) throws FLException;
	
	public int buildMaterialFinance(DecorationPO decorationPO, MaterialPO materialPO, MaterialReceiptPO materialReceiptPO,  UserPO poster) throws FLException;
	
}
