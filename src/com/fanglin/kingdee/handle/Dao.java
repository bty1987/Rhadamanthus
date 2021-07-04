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

@Repository("kandleDao")
public class Dao {

	public void save(Bean bean) throws Exception {

		if (!Kandle.Login())
			return;

		Kandle.Save(bean.getFormId(), bean.param());
	}
}
