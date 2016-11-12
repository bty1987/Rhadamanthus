/**
 * @File Name		: DecorationOperateServiceImpl.java
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2016-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.decoration.service.DecorationOperateService;

@Service("decorationOperateService")
@Transactional(readOnly=true)
public class DecorationOperateServiceImpl implements DecorationOperateService {
	
//	@Autowired
//	private DecorationOperateDao decorationOperateDao;

}
