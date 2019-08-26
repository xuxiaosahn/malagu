import { container } from '@malagu/core/lib/common/dynamic-container';
import { Dispatcher, Context } from '@malagu/core/lib/node';
import { HttpContext } from './context';
import { ContainerProvider } from '@malagu/core/lib/common/container-provider';
import * as getRawBody from 'raw-body';

export async function init(context: any, callback: any) {
    try {
        await container;
        callback(undefined, '');
    } catch (err) {
        callback(err);
    }
}

export async function handler(request: any, response: any, context: any) {
    request.body = await getRawBody(request).then(body => body.toString());
    const httpContext = new HttpContext(request, response, context);
    container.then(c => {
        ContainerProvider.set(c);
        const dispatcher = c.get<Dispatcher<HttpContext>>(Dispatcher);
        Context.run(() => dispatcher.dispatch(httpContext));
    });
}