/**
 * @File Name		: MaterialSubOrderBalanceServiceImpl.java
 * @Package   	: com.fanglin.material.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.material.service.MaterialSubOrderBalanceService;

@Service("materialSubOrderBalanceService")
@Transactional(readOnly=true)
public class MaterialSubOrderBalanceServiceImpl implements MaterialSubOrderBalanceService {

}
