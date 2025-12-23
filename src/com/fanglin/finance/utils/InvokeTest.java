package com.fanglin.finance.utils;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

public class InvokeTest {

	public static void main(String[] args) throws Exception {

		InvokeHelper.POST_K3CloudURL = "http://192.168.5.28/k3cloud/";
		String dbId = "5e0560db527bd2"; // 账套ID 每个账套不同ID 是固定的
		String uid = "bty"; // 账户
		String pwd = "fanglin1918";// 密码
		int lang = 2052;// 多语言ID 2052代表中文 默认2052即可

		boolean flag = InvokeHelper.Login(dbId, uid, pwd, lang);

		if (flag) { // 先登录服务器认证后再做业务操作

			// 业务对象Id
			String sFormId = "ora_TestBill"; // 测试单据

			// 明细列表 组合JSON 串
			List<String> listEntry = new ArrayList<String>();
			for (int i = 0; i < 3; i++) {// 模拟插入3条明细
				listEntry.add(String.format("{\"F_ora_EntryTxtText1\": \"明细1-%d\",\"F_ora_EntryTxtText2\": \"明细2-%d\"}", i, i));
			}

			// 组合 webapi 字符串
			// 需要保存的数据
			// 如下字段可能需要根据自己实际值做修改
			// FCustId FSalerId FMaterialId FUnitID
			String sContent = "{\"Model\":{\"FID\":0," + "\"F_ora_txtTest1\":\"测试1\"," + // 单据头测试字段 1
					"\"F_ora_txtTest2\":\"测试2\"," + // 单据头测试字段 2
					"\"F_ora_OrgId\": {\"FNumber\": \"100\" }," + // 赋值单据头的 组织字段 组织字段比较复杂 通过 编码赋值（这类字段以后再说 暂先测试）
					"\"FEntity\": [" + StringUtils.join(listEntry, ",") + "]}";

			// 获取结果
			String strMessage = InvokeHelper.Save(sFormId, sContent);
			// 二、返回结果：
			// {"Result":{"ResponseStatus":{"ErrorCode":"","IsSuccess":"false","Errors":[{"FieldName":"","Message":"","DIndex":0}],"SuccessEntitys":[{"Id":"","Number":"","DIndex":0}],"SuccessMessages":[{"FieldName":"","Message":"","DIndex":0}],"MsgCode":""},"Id":"","Number":"","NeedReturnData":[{}]}}
			// IsSuccess:操作是否成功，
			// Errors:如果失败，具体失败原因
			// DIndex:原始数据行号

			System.out.println(strMessage);
		}
	}
}
