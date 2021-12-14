/**
 * @File Name		: Dao.java
 * @Package   	: com.fanglin.kingdee.handle
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.handle;

import org.springframework.stereotype.Repository;

import com.fanglin.core.interceptor.FLException;

@Repository("kandleDao")
public class Dao {

	public String save(Bean bean) throws FLException {

		if (!Kandle.Login())
			return "";

		return Kandle.Save(bean.getFormId(), bean.param());
	}

	public void audit(Bean bean, String no) throws FLException {

		if (!Kandle.Login())
			return;

		String sContent = "{\"Numbers\":[\"" + no + "\"]}";

		Kandle.Submit(bean.getFormId(), sContent);

		Kandle.Audit(bean.getFormId(), sContent);

	}

	public void saveAudit(Bean bean) throws FLException {

		if (!Kandle.Login())
			return;

		String no = Kandle.Save(bean.getFormId(), bean.param());

		String sContent = "{\"Numbers\":[\"" + no + "\"]}";

		Kandle.Submit(bean.getFormId(), sContent);

		Kandle.Audit(bean.getFormId(), sContent);

	}
}
