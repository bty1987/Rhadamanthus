/**
 * @File Name		: GroupService.java
 * @Package   	: com.fanglin.dingding.service
 * @Version		: 1.0
 * @Date			: 2022-5-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.bean.AppMessage;
import com.fanglin.dingding.bean.Group;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;

@Service("groupDDService")
@Transactional(readOnly = true)
public class GroupService {

	@Autowired
	private AuthService authDDService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private CompanyDao companyDao;

	public Group query(Group group, int company) throws FLException {

		String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(company));

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		String url = String.format(DDApi.DDAPI_QUERY_GROUP_STR, oapiHost.getValue(), accessToken, group.getChatId());

		JSONObject json = HttpHelper.httpGet(url);

		if (json == null) {
			throw new FLException(270021, "群信息获取失败");
		} else if (json.getInteger("errcode") != 0) {
			System.out.println(url);
			System.out.println(String.format("%d-%s", json.getInteger("errcode"), json.getString("errmsg")));

			throw new FLException(240015, String.format("%d-%s", json.getInteger("errcode"), json.getString("errmsg")));
		}

		return JSON.parseObject(json.getJSONObject("chat_info").toJSONString(), Group.class);
	}

	public int create(Group group, int company) throws FLException {

		String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(company));

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		String url = String.format(DDApi.DDAPI_CREATE_GROUP_STR, oapiHost.getValue(), accessToken);

		JSONObject json = HttpHelper.httpPost(url, group.toJson());

		if (json == null) {
			throw new FLException(270020, "群创建失败");
		}

		int errcode = json.getInteger("errcode");

		if (errcode != 0) {
			System.out.println(url);
			System.out.println(String.format("%d-%s", json.getInteger("errcode"), json.getString("errmsg")));
		}

		group.setChatId(json.getString("chatid"));
		group.setOpenId(json.getString("openConversationId"));

		return errcode;
	}

	public int update(Group group, int company) throws FLException {

		String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(company));

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		String url = String.format(DDApi.DDAPI_UPDATE_GROUP_STR, oapiHost.getValue(), accessToken);

		JSONObject json = HttpHelper.httpPost(url, group.addUser());

		if (json == null) {
			throw new FLException(270020, "群创建失败");
		}

		int errcode = json.getInteger("errcode");

		if (errcode != 0) {
			System.out.println(url);
			System.out.println(String.format("%d-%s", json.getInteger("errcode"), json.getString("errmsg")));
		}

		return 0;
	}

	public int template(Group group, int company) throws FLException {

		String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(company));

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		String url = String.format(DDApi.DDAPI_TEMPLATE_GROUP_STR, oapiHost.getValue(), accessToken);

		JSONObject json = HttpHelper.httpPost(url, group.template("72b64a73-bf35-42a8-bcaa-5931def6066d"));

		if (json == null) {
			throw new FLException(270020, "群模版化失败");
		}

		int errcode = json.getInteger("errcode");

		if (errcode != 0) {
			System.out.println(url);
			System.out.println(String.format("%d-%s", json.getInteger("errcode"), json.getString("errmsg")));
		}

		return 0;
	}

	public int send(Group group, JSONObject message, int company) throws FLException {

		String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(company));

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		String url = String.format(DDApi.DDAPI_SEND_GROUP_STR, oapiHost.getValue(), accessToken);

		JSONObject json = HttpHelper.httpPost(url, group.send(message));

		if (json == null) {
			throw new FLException(270020, "群创建失败");
		}

		int errcode = json.getInteger("errcode");

		if (errcode != 0) {
			System.out.println(url);
			System.out.println(String.format("%d-%s", json.getInteger("errcode"), json.getString("errmsg")));
		}

		return 0;
	}

	public static void main(String[] args) {

		String accessToken = "915ad6d45d623b2b85fcb348db3b5437";
		String host = "https://oapi.dingtalk.com";

		// Group group = new Group().init();
		//
		// group.setName("测试群创建");
		// group.setOwner("FL-00479");
		//
		// group.getUsers().add("FL-00479");
		//
		// System.out.println(group.toJson());
		//
		// String url = String.format(DDApi.DDAPI_CREATE_GROUP_STR, host, accessToken);
		//
		// JSONObject json = HttpHelper.httpPost(url, group.toJson());
		//
		// System.out.println(json);
		//
		// group.setChatId(json.getString("chatid"));
		// group.setOpenId(json.getString("openConversationId"));
		//
		// System.out.println(group.toJson());

		// Group group = new Group();
		//
		// group.setChatId("chatbab69ab64d8a14faa596ba74586c76d9");
		// group.setOpenId("cidRvWRYcrEGB+zPI4XebakjQ==");
		//
		// group.getUsers().add("FL-26150");
		// group.setName("代码改个名");
		//
		// String url = String.format(DDApi.DDAPI_UPDATE_GROUP_STR, host, accessToken);
		//
		// JSONObject json = HttpHelper.httpPost(url, group.toJson());
		//
		// System.out.println(json);

		// TextMessage text = new TextMessage("测试一下群信息发送, 文本类型");
		//
		// Group group = new Group();
		//
		// group.setChatId("chatbab69ab64d8a14faa596ba74586c76d9");
		// group.setOpenId("cidRvWRYcrEGB+zPI4XebakjQ==");
		//
		// String url = String.format(DDApi.DDAPI_SEND_GROUP_STR, host, accessToken);
		//
		// JSONObject json = HttpHelper.httpPost(url, group.send(text.delivery()));
		//
		// System.out.println(json);

		// ImageMessage image = new ImageMessage("http://www.fanglinserver.com/group1/M00/0E/BC/wKgFZlr3sD2ANRc3AAAsvO3F33A403.jpg");
		//
		// Group group = new Group();
		//
		// group.setChatId("chatbab69ab64d8a14faa596ba74586c76d9");
		// group.setOpenId("cidRvWRYcrEGB+zPI4XebakjQ==");
		//
		// String url = String.format(DDApi.DDAPI_SEND_GROUP_STR, host, accessToken);
		//
		// JSONObject json = HttpHelper.httpPost(url, group.send(image.delivery()));
		//
		// System.out.println(json);

		AppMessage app = new AppMessage("应用消息", "http://www.fanglinserver.com/test/dingding/index/index.html", "查询更多");

		Group group = new Group();

		group.setChatId("chatbab69ab64d8a14faa596ba74586c76d9");
		group.setOpenId("cidRvWRYcrEGB+zPI4XebakjQ==");

		String url = String.format(DDApi.DDAPI_SEND_GROUP_STR, host, accessToken);

		System.out.println(url);
		System.out.println(app.delivery());
		System.out.println(group.send(app.delivery()));

		JSONObject json = HttpHelper.httpPost(url, group.send(app.delivery()));

		System.out.println(json);

		// Group group = new Group();
		//
		// group.setOwner("FL-00479");
		// group.setChatId("chatb8494c9a1262c21432b786002abec97e");
		// group.setOpenId("cidLz64knqVTqUb3KsQu9yQEA==");
		//
		// System.out.println(group.template("72b64a73-bf35-42a8-bcaa-5931def6066d"));
		//
		// String url = String.format(DDApi.DDAPI_TEMPLATE_GROUP_STR, host, accessToken);
		//
		// System.out.println(url);
		//
		// JSONObject json = HttpHelper.httpPost(url, group.template("72b64a73-bf35-42a8-bcaa-5931def6066d"));
		//
		// System.out.println(json);

	}
}
