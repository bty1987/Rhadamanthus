/**
 * @File Name		: PostHandlerInvoker.java
 * @Package   		: com.fanglin.approval.engine
 * @Version			: 1.0
 * @Description		: 后置处理器反射调用器。复用钉钉 DingTalkCallbackServiceImpl.invokeHandler 的成熟设计,
 * 					  把节点配置的 postHandler("beanClass#methodName")反射调用到具体业务 Bean。
 * 					  <p>方法签名约定: void methodName(ApprovalPO approvalPO) throws FLException
 * 					  <p>与 ApprovalNodeHandler SPI 互补:SPI 适合编码实现的强类型业务,
 * 					  postHandler 适合运维配置驱动的零代码接入(与 dingtalkapprovalconfig 一致)。
 */

package com.fanglin.approval.engine;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.interceptor.FLException;

@Component
public class PostHandlerInvoker {

	@Autowired
	private ApplicationContext applicationContext;

	/**
	 * 反射调用后置处理器。
	 *
	 * @param handlerExpr 处理器表达式,格式 "beanClass#methodName",如
	 *                    "com.fanglin.decoration.service.impl.DecorationContractServiceImpl#makeContract"
	 * @param approvalPO  审批主表对象(业务上下文)
	 */
	public void invoke(String handlerExpr, ApprovalPO approvalPO) throws FLException {

		if (handlerExpr == null || handlerExpr.trim().isEmpty()) {
			return;
		}

		String[] parts = handlerExpr.split("#");
		if (parts.length != 2) {
			throw new FLException(240030, "后置处理器表达式格式错误,应为 beanClass#methodName: " + handlerExpr);
		}

		String beanClassName = parts[0].trim();
		String methodName = parts[1].trim();

		try {
			Class<?> beanClass = Class.forName(beanClassName);
			Object bean = applicationContext.getBean(beanClass);

			Method method = beanClass.getMethod(methodName, ApprovalPO.class);
			method.invoke(bean, approvalPO);

		} catch (ClassNotFoundException e) {
			throw new FLException(240031, "后置处理器类未找到: " + beanClassName);
		} catch (NoSuchMethodException e) {
			throw new FLException(240032, "后置处理器方法未找到: " + beanClassName + "#" + methodName);
		} catch (InvocationTargetException e) {
			Throwable target = e.getTargetException();
			if (target instanceof FLException) {
				throw (FLException) target;
			}
			throw new FLException(240033, "后置处理器执行异常: " + target.getMessage());
		} catch (Exception e) {
			throw new FLException(240033, "后置处理器反射异常: " + e.getMessage());
		}
	}

}
