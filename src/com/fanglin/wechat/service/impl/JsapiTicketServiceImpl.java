/**
 * @File Name		: WJsapiTicketServiceImpl.java
 * @Package   	: com.fanglin.common.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.dao.JsapiTicketDao;
import com.fanglin.wechat.po.JsapiTicketPO;
import com.fanglin.wechat.service.JsapiTicketService;
import com.fanglin.wechat.vo.JsapiTicketVO;

@Service("jsapiTicketService")
@Transactional(readOnly = true)
public class JsapiTicketServiceImpl implements JsapiTicketService {

	@Autowired
	private JsapiTicketDao jsapiTicketDao;

	@Override
	public JsapiTicketVO queryJsapiTicketForNew(String company) {

		JsapiTicketPO jsapiTicketPO = jsapiTicketDao.queryJsapiTicket(FormatUtil.decodeCompany(company));
		JsapiTicketVO jsapiTicketVO = new JsapiTicketVO();

		BeanUtil.copyProperties(jsapiTicketPO, jsapiTicketVO);

		return jsapiTicketVO;
	}

}
