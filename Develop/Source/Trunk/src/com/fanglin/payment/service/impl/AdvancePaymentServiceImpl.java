/**
 * @File Name		: AdvancePaymentServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2015-9-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.payment.service.AdvancePaymentService;

@Service("advancePaymentService")
@Transactional(readOnly=true)
public class AdvancePaymentServiceImpl implements AdvancePaymentService {

}
